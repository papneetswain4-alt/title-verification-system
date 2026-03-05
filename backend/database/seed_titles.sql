-- Seed some approved publications as per problem statement examples
INSERT INTO publications (title, normalized_title, status) VALUES 
('The Hindu', 'THE HINDU', 'Approved'),
('Indian Express', 'INDIAN EXPRESS', 'Approved'),
('Namaskar', 'NAMASKAR', 'Approved'),
('Morning Herald', 'MORNING HERALD', 'Approved'),
('Daily Evening', 'DAILY EVENING', 'Approved'),
('The Times of India', 'THE TIMES OF INDIA', 'Approved'),
('Daily Tribune', 'DAILY TRIBUNE', 'Approved'),
('Sunrise Chronicle', 'SUNRISE CHRONICLE', 'Approved'),
('Dawn Dispatch', 'DAWN DISPATCH', 'Approved'),
('Samachar Darpan', 'SAMACHAR DARPAN', 'Approved'),
('Vishwa Samachar', 'VISHWA SAMACHAR', 'Approved'),
('Punjab Kesari', 'PUNJAB KESARI', 'Approved'),
('Dainik Jagran', 'DAINIK JAGRAN', 'Approved'),
('Hindustan Times', 'HINDUSTAN TIMES', 'Approved'),
('Malayala Manorama', 'MALAYALA MANORAMA', 'Approved'),
('Mathrubhumi', 'MATHRUBHUMI', 'Approved'),
('The Statesman', 'THE STATESMAN', 'Approved'),
('The Telegraph', 'THE TELEGRAPH', 'Approved');

-- Update phonetic codes for seeded titles
-- (In a real system, we'd do this via the application logic, but for seeding 
-- we'll just let the backend handle it during first load via the setupDb script)
