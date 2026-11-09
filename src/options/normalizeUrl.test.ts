import { normalizeUrl } from './normalizeUrl';

test("a proper URL shouldn't be mangled", () => {
  expect(normalizeUrl('http://www.google.com')).toEqual(
    'http://www.google.com/',
  );
});

test('missing protocol should default to https', () => {
  expect(normalizeUrl('www.google.com')).toEqual('https://www.google.com/');
});

test('host:port without protocol should default to https', () => {
  expect(normalizeUrl('localhost:8080')).toEqual('https://localhost:8080/');
});

test.each([
  ['file:/tmp/index.html', 'file:///tmp/index.html'],
  ['http:/example.com', 'http://example.com/'],
  [' https://example.com ', 'https://example.com/'],
  ['example.com:80//', 'https://example.com:80//'],
])('%p normalizes to %p', (input, expected) => {
  expect(normalizeUrl(input)).toEqual(expected);
});

test("a proper URL shouldn't be mangled", () => {
  expect(() => {
    normalizeUrl('http://ssddfoo bar');
  }).toThrow('Your url "http://ssddfoo bar" is invalid');
});
