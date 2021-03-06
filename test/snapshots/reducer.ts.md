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
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
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

## Adding multiple items

> Snapshot 1

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Snapshot 2

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
        test_id_3: {
          data: {
            id: 'test_id_3',
            name: 'Test item test_id_3',
            prop: 'fake prop test_id_3',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
        test_id_4: {
          data: {
            id: 'test_id_4',
            name: 'Test item test_id_4',
            prop: 'fake prop test_id_4',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_1',
        'test_id_2',
        'test_id_3',
        'test_id_4',
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

## Removing an item

> Snapshot 1

    {
      byId: {
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Item that does not exist

    {
      byId: {
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Empty store

    {
      byId: {},
      ids: [],
      meta: {
        error: null,
        loading: false,
      },
    }

## Updating an item

> Partial data update

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Updated name test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Partial meta update

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Updated name test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: null,
            loading: true,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Partial meta and data update

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Updated name again test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: {
              message: 'Not found',
              status: 404,
            },
            loading: true,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

## Updating status of a request for a list of items

> Request start

    {
      byId: {},
      ids: [],
      meta: {
        error: null,
        loading: true,
      },
    }

> Request success

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request failure

    {
      byId: {},
      ids: [],
      meta: {
        error: {
          status: 404,
        },
        loading: false,
      },
    }

> Request success after a failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

## Updating status of a request for a single item [DELETE]

> Request start

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: null,
            loading: true,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request success

    {
      byId: {
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Request failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: {
              status: 404,
            },
            loading: false,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request success after a failure

    {
      byId: {
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

## Updating status of a request for a single item [GET]

> Request start

    {
      byId: {
        test_id_1: {
          data: null,
          meta: {
            error: null,
            loading: true,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
        'test_id_1',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Request success

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
        'test_id_1',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Request failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: {
              status: 404,
            },
            loading: false,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
        'test_id_1',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

> Request success after a failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
          },
        },
      },
      ids: [
        'test_id_2',
        'test_id_1',
      ],
      meta: {
        error: null,
        loading: false,
      },
    }

## Updating status of a request for a single item [PUT]

> Request start

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: null,
            loading: true,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request success

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Updated name test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Test item test_id_1',
            prop: 'fake prop test_id_1',
          },
          meta: {
            error: {
              status: 400,
            },
            loading: false,
          },
        },
        test_id_2: {
          data: {
            id: 'test_id_2',
            name: 'Test item test_id_2',
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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

> Request success after a failure

    {
      byId: {
        test_id_1: {
          data: {
            id: 'test_id_1',
            name: 'Updated name again test_id_1',
            prop: 'fake prop test_id_1',
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
            prop: 'fake prop test_id_2',
          },
          meta: {
            error: null,
            loading: false,
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
