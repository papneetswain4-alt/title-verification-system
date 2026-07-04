// Mock storage service for tests
const mockStorage = {};

module.exports = {
    getTitles: jest.fn(() => Promise.resolve([...mockStorage.titles])),
    addTitles: jest.fn((titles) => {
        mockStorage.titles = [...(mockStorage.titles || []), ...titles];
        return Promise.resolve();
    }),
    titles: [],
    setTitles: (titles) => {
        mockStorage.titles = titles;
    }
};
