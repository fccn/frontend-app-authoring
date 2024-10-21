import { mockContentSearchConfig, mockSearchResult } from '../../search-manager/data/api.mock';
import {
  initializeMocks,
  fireEvent,
  render,
  screen,
  within,
} from '../../testUtils';
import mockResult from '../__mocks__/library-search.json';
import mockCollectionResult from '../__mocks__/collection-search.json';
import {
  mockContentLibrary,
  mockGetCollectionMetadata,
  mockGetContentLibraryV2List,
  mockLibraryBlockMetadata,
} from '../data/api.mocks';

import { ComponentPicker } from './ComponentPicker';

mockContentLibrary.applyMock();
mockContentSearchConfig.applyMock();
mockGetCollectionMetadata.applyMock();
mockGetContentLibraryV2List.applyMock();
mockLibraryBlockMetadata.applyMock();

let postMessageSpy: jest.SpyInstance;

describe('<ComponentPicker />', () => {
  beforeEach(() => {
    initializeMocks();
    postMessageSpy = jest.spyOn(window.parent, 'postMessage');

    mockSearchResult(mockResult);
  });

  it('should pick component using the component card button', async () => {
    render(<ComponentPicker />);

    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue(/lib:sampletaxonomyorg1:tl1/i));

    // Wait for the content library to load
    await screen.findByText(/Change Library/i);
    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();

    // Click the add component from the component card
    fireEvent.click(screen.queryAllByRole('button', { name: 'Add' })[0]);

    expect(postMessageSpy).toHaveBeenCalledWith({
      usageKey: 'lb:Axim:TEST:html:571fe018-f3ce-45c9-8f53-5dafcb422fdd',
      type: 'pickerComponentSelected',
      category: 'html',
    }, '*');
  });

  it('should pick component using the component sidebar', async () => {
    render(<ComponentPicker />);

    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue(/lib:sampletaxonomyorg1:tl1/i));

    // Wait for the content library to load
    await screen.findByText(/Change Library/i);
    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();

    // Click on the component card to open the sidebar
    fireEvent.click(screen.queryAllByText('Introduction to Testing')[0]);

    const sidebar = await screen.findByTestId('library-sidebar');

    // Click the add component from the component sidebar
    fireEvent.click(within(sidebar).getByRole('button', { name: 'Add to Course' }));

    expect(postMessageSpy).toHaveBeenCalledWith({
      usageKey: 'lb:Axim:TEST:html:571fe018-f3ce-45c9-8f53-5dafcb422fdd',
      type: 'pickerComponentSelected',
      category: 'html',
    }, '*');
  });

  it('should pick component inside a collection using the card', async () => {
    render(<ComponentPicker />);

    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue(/lib:sampletaxonomyorg1:tl1/i));

    // Wait for the content library to load
    await screen.findByText(/Change Library/i);
    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();

    // Click on the collection card to open the sidebar
    fireEvent.click(screen.queryAllByText('Collection 1')[0]);

    const sidebar = await screen.findByTestId('library-sidebar');

    // Mock the collection search result
    mockSearchResult(mockCollectionResult);

    // Click the add component from the component card
    fireEvent.click(within(sidebar).getByRole('button', { name: 'Open' }));

    // Wait for the collection  to load
    await screen.findByText(/Back to Library/i);
    await screen.findByText('Introduction to Testing');

    // Click the add component from the component card
    fireEvent.click(screen.queryAllByRole('button', { name: 'Add' })[0]);

    expect(postMessageSpy).toHaveBeenCalledWith({
      usageKey: 'lb:Axim:TEST:html:571fe018-f3ce-45c9-8f53-5dafcb422fdd',
      type: 'pickerComponentSelected',
      category: 'html',
    }, '*');
  });

  it('should pick component inside a collection using the sidebar', async () => {
    render(<ComponentPicker />);

    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue(/lib:sampletaxonomyorg1:tl1/i));

    // Wait for the content library to load
    await screen.findByText(/Change Library/i);
    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();

    // Click on the collection card to open the sidebar
    fireEvent.click(screen.queryAllByText('Collection 1')[0]);

    const sidebar = await screen.findByTestId('library-sidebar');

    // Mock the collection search result
    mockSearchResult(mockCollectionResult);

    // Click the add component from the component card
    fireEvent.click(within(sidebar).getByRole('button', { name: 'Open' }));

    // Wait for the collection  to load
    await screen.findByText(/Back to Library/i);
    await screen.findByText('Introduction to Testing');

    // Click on the collection card to open the sidebar
    fireEvent.click(screen.getByText('Introduction to Testing'));

    const collectionSidebar = await screen.findByTestId('library-sidebar');

    // Click the add component from the collection sidebar
    fireEvent.click(within(collectionSidebar).getByRole('button', { name: 'Add to Course' }));

    expect(postMessageSpy).toHaveBeenCalledWith({
      usageKey: 'lb:Axim:TEST:html:571fe018-f3ce-45c9-8f53-5dafcb422fdd',
      type: 'pickerComponentSelected',
      category: 'html',
    }, '*');
  });

  it('should return to library selection', async () => {
    render(<ComponentPicker />);

    expect(await screen.findByText('Test Library 1')).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue(/lib:sampletaxonomyorg1:tl1/i));

    // Wait for the content library to load
    await screen.findByText(/Change Library/i);
    fireEvent.click(screen.getByText(/Change Library/i));

    await screen.findByText('Select which Library would you like to reference components from.');
  });
});
