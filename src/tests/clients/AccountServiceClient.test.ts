import axios from 'axios';
import { userFactory } from '@cig-platform/factories';

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
    it('returns the user', async () => {
      const authUserData = {
        email: 'email',
        password: 'password'
      };
      const user = userFactory(authUserData);
      const mockResponse = {
        ok: true,
        user
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.authUser(authUserData.email, authUserData.password)).toBe(mockResponse.user);
      expect(mockAxiosPost).toHaveBeenCalledWith('/auth', authUserData);
    });
  });
});
