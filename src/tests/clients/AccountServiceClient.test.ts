import axios from 'axios';

import AccountServiceClient from '@Clients/AccountServiceClient';

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
  });
});
