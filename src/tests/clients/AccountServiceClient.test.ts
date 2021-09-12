import axios from 'axios';

import AccountServiceClient from '../../clients/AccountServiceClient';

describe('AccountServiceClient', () => {
  describe('.postUser', () => {
    it('returns the user', async () => {
      const mockResponse = {
        ok: true,
        user: {},
        message: 'example message'
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.postUser(mockResponse.user)).toBe(mockResponse.user);
      expect(mockAxiosPost).toHaveBeenCalledWith('/users', mockResponse.user);
    });

    it('returns an error when get an api error', async () => {
      const mockResponse = {
        ok: false,
        error: {
          message: 'example message',
          name: 'example name'
        }
      };
      const mockAxiosPost = jest.fn().mockRejectedValue({
        response: {
          data: mockResponse
        }
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.postUser({})).toBe(mockResponse.error);
    });
  });

  describe('.getUser', () => {
    it('returns the user', async () => {
      const mockUserId = 'user id';
      const mockResponse = {
        ok: true,
        user: {
          id: mockUserId
        },
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.getUser(mockUserId)).toBe(mockResponse.user);
      expect(mockAxiosGet).toHaveBeenCalledWith(`/users/${mockUserId}`);
    });

    it('returns undefined when get an api error', async () => {
      const mockUserId = 'user id';
      const mockAxiosGet = jest.fn().mockRejectedValue({});
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.getUser(mockUserId)).toBeUndefined();
      expect(mockAxiosGet).toHaveBeenCalledWith(`/users/${mockUserId}`);
    });
  });

  describe('.authUser', () => {
    it('returns the token', async () => {
      const mockUser = {
        email: 'email',
        password: 'password'
      };
      const mockResponse = {
        ok: true,
        token: 'fake token',
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.authUser(mockUser.email, mockUser.password)).toBe(mockResponse.token);
      expect(mockAxiosPost).toHaveBeenCalledWith('/auth', mockUser);
    });

    it('returns undefined when get an api error', async () => {
      const mockUser = {
        email: 'email',
        password: 'password'
      };
      const mockAxiosPost = jest.fn().mockRejectedValue({});
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.authUser(mockUser.email, mockUser.password)).toBeUndefined();
      expect(mockAxiosPost).toHaveBeenCalledWith('/auth', mockUser);
    });
  });
});
