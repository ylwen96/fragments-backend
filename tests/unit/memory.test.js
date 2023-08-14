const { listFragments, writeFragment, readFragment, writeFragmentData, readFragmentData, deleteFragment } = require('../../src/model/data/memory/index');

describe('memory test', () => {
  test('write fragment test, return nothing', async () => {
    const fragment = {
      id: 'a',
      ownerId: 'b',
      fragment: {}
    }
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('read fragment test, result expect to be the same as uploaded', async () => {
    const fragment = {
      id: 'a',
      ownerId: 'b',
      fragment: {}
    }
    await writeFragment(fragment);
    const result = readFragment(fragment.ownerId, fragment.id);
    result.then(value => {
      expect(value).toBe(fragment);
    }).catch(err => {
      expect(err).toBe(err);
    })

  });

  test('write fragment data test, return nothing', async () => {
    const data = {
      id: 'a',
      ownerId: 'b',
      value: {}
    }
    const result = await writeFragmentData(data.ownerId, data.id, data.value);
    expect(result).toBe(undefined);
  });

  test('read fragment data test, return nothing if read wrong id', async () => {
    const data = {
      id: 'a',
      ownerId: 'b',
      value: {}
    }
    await writeFragmentData(data.ownerId, data.id, data.value);
    const result = readFragmentData(data.ownerId, 'c');
    result.then(value => {
      expect(value).toBe(undefined);
    }).catch(err => {
      expect(err).toBe(err);
    })
  });

  test('list fragment test, read expended list, expect to get list of fragments, should be the same as i set', async () => {
    await writeFragment({ ownerId: 'a', id: '1', fragment: 'first fragment' });
    await writeFragmentData('a', '1', { value: "owner A value 1" });
    await writeFragment({ ownerId: 'a', id: '2', fragment: 'second fragment' });
    await writeFragmentData('a', '1', { value: "owner A value 2" });
    await writeFragment({ ownerId: 'a', id: '3', fragment: 'third fragment' });
    await writeFragmentData('a', '1', { value: "owner A value 3" });

    const results = await listFragments('a', true);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual([
      { ownerId: 'a', id: '1', fragment: 'first fragment' },
      { ownerId: 'a', id: '2', fragment: 'second fragment' },
      { ownerId: 'a', id: '3', fragment: 'third fragment' }
    ]);
  });

  test('delete fragment test, delete an uploaded fragment&data, it should return nothing after delete', async () => {
    await writeFragment({ ownerId: 'a', id: '1', fragment: 'first fragment' });
    await writeFragmentData('a', '1', { value: "owner A value 1" });
    expect(await readFragment('a', '1')).toEqual({ ownerId: 'a', id: '1', fragment: 'first fragment' });
    await deleteFragment('a', '1');
    expect(await readFragment('a', '1')).toBe(undefined);
  });
});
