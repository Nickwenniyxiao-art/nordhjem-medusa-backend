import { GET } from '../api/health/route';

type MockReq = {
  scope: {
    resolve: (key: string) => unknown;
  };
};

type MockRes = {
  status: any;
  json: any;
};

describe('health route GET', () => {
  const buildRes = (): MockRes => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    } as MockRes;

    res.status.mockReturnValue(res);
    return res;
  };

  it('returns 200 when database and redis checks pass', async () => {
    const req = {
      scope: {
        resolve: (key: string) => {
          if (key === 'pgConnection') {
            return { raw: jest.fn().mockResolvedValue('ok') };
          }
          if (key === 'redis') {
            return { ping: jest.fn().mockResolvedValue('PONG') };
          }
          throw new Error(`missing ${key}`);
        },
      },
    } as MockReq;

    const res = buildRes();
    await GET(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        checks: {
          database: 'ok',
          redis: 'ok',
        },
      }),
    );
  });

  it('returns 503 when database check fails', async () => {
    const req = {
      scope: {
        resolve: (key: string) => {
          if (key === 'pgConnection') {
            return { raw: jest.fn().mockRejectedValue(new Error('db error')) };
          }
          if (key === 'redis') {
            return { ping: jest.fn().mockResolvedValue('PONG') };
          }
          throw new Error(`missing ${key}`);
        },
      },
    } as MockReq;

    const res = buildRes();
    await GET(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        checks: {
          database: 'error',
          redis: 'ok',
        },
      }),
    );
  });
});
