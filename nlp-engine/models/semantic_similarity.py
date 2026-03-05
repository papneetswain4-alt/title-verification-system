import os
import sys
import faiss # type: ignore
import numpy as np # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore

# Add parent directory to sys.path to help with package resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Load exactly what was asked for
model_name = 'all-MiniLM-L6-v2'
model = SentenceTransformer(model_name)

# Use absolute paths for vector store
VECTOR_STORE_PATH = os.path.join(parent_dir, 'vector_store', 'title_vectors.faiss')
TITLES_METADATA_PATH = os.path.join(parent_dir, 'vector_store', 'title_metadata.npy')

class SemanticSimilarityEngine:
    def __init__(self):
        self.dimension = model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatL2(self.dimension) # Initialize immediately to satisfy linters
        self.titles = []
        self._load_or_create_index()

    def _load_or_create_index(self):
        # Creates FAISS index and local metadata array, loading existing if available
        if os.path.exists(VECTOR_STORE_PATH) and os.path.exists(TITLES_METADATA_PATH):
            print(f"Loading existing FAISS index from {VECTOR_STORE_PATH}")
            self.index = faiss.read_index(VECTOR_STORE_PATH)
            self.titles = np.load(TITLES_METADATA_PATH, allow_pickle=True).tolist()
        else:
            print("Initializing new empty FAISS index")
            self.index = faiss.IndexFlatL2(self.dimension)
            self.titles = []

    def _save_index(self):
        if self.index is None: return
        os.makedirs(os.path.dirname(VECTOR_STORE_PATH), exist_ok=True)
        faiss.write_index(self.index, VECTOR_STORE_PATH)
        np.save(TITLES_METADATA_PATH, np.array(self.titles))

    def add_titles(self, new_titles):
        """ Add a list of title strings to the index and save. """
        if not new_titles:
            return

        embeddings = model.encode(new_titles, normalize_embeddings=True)
        self.index.add(np.array(embeddings))
        self.titles.extend(new_titles)
        self._save_index()
        print(f"Added {len(new_titles)} titles to vector store. Total: {self.index.ntotal}")

    def check_similarity(self, candidate_title, threshold=0.75):
        """ 
        Compares candidate_title against the vector store using cosine similarity math.
        FAISS IndexFlatL2 with normalized embeddings effectively does cosine distance.
        score = 1 - (L2_dist^2 / 2)
        """
        if self.index.ntotal == 0:
            return {"maxScore": 0, "matches": []}

        # Encode and normalize
        embedding = model.encode([candidate_title], normalize_embeddings=True)
        
        # Search top 5
        k = min(5, self.index.ntotal)
        distances, indices = self.index.search(np.array(embedding), k)
        
        matches = []
        max_score = 0

        for i in range(k):
            # Convert L2 distance of normalized vectors to Cosine Similarity score (0 to 1)
            # Cosine similarity = 1 - (distance^2 / 2)
            try:
                # Access indices and distances explicitly to satisfy linter
                current_dist = distances[0][i] # type: ignore
                current_idx = indices[0][i] # type: ignore
                
                dist = float(current_dist)
                idx = int(current_idx)
            except (IndexError, TypeError, ValueError):
                continue
            
            if idx == -1: continue # Empty hit

            cosine_sim = 1.0 - (dist / 2.0)
            score_percent = round(cosine_sim * 100)
            
            if score_percent > max_score:
                max_score = score_percent
                
            if cosine_sim >= threshold:
                matches.append({
                    "title": self.titles[idx],
                    "score": score_percent,
                    "reason": "Conceptual Similarity"
                })

        return {
            "maxScore": max_score,
            "matches": matches
        }

# Global singleton
engine = SemanticSimilarityEngine()
