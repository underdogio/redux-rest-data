# Snapshot report for `test/reducer.ts`

The actual snapshot is saved in `reducer.ts.snap`.

Generated by [AVA](https://ava.li).

## Adding an item

> Snapshot 1

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_1',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Snapshot 2

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
          },
          meta: {
            error: null,
            loading: true,
          },
        },
      },
      ids: [
        'test_id_1',
        'test_id_2',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

## Initial state

> Snapshot 1

    {
      byId: {},
      ids: [],
      meta: {
        error: null,
        loading: false,
      },
    }