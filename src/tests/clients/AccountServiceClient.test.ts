import axios from 'axios';
import faker from 'faker';
import { userFactory } from '@cig-platform/factories';
import { UserRegisterTypeEnum } from '@cig-platform/enums';

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
      expect(mockAxiosPost).toHaveBeenCalledWith('/v1/users', mockResponse.user);
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
      expect(mockAxiosGet).toHaveBeenCalledWith(`/v1/users/${mockUserId}`);
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

      expect(await accountServiceClient.authUser(
        authUserData.email,
        authUserData.password,
        UserRegisterTypeEnum.Default
      )).toBe(mockResponse.user);
      expect(mockAxiosPost).toHaveBeenCalledWith('/v1/auth', expect.objectContaining(authUserData));
    });
  });

  describe('.getUsers', () => {
    it('returns the users', async () => {
      const users = Array(10).fill(null).map(() => userFactory());
      const email = faker.internet.email();
      const mockResponse = {
        ok: true,
        users
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const accountServiceClient = new AccountServiceClient('');

      expect(await accountServiceClient.getUsers({ email })).toBe(mockResponse.users);
      expect(mockAxiosGet).toHaveBeenCalledWith('/v1/users', { params: { email } });
    });
  });
});
