import axios from 'axios';

import PoultryServiceClient from '../../clients/PoultryServiceClient';

describe('PoultryServiceClient', () => {
  describe('.postPoultry', () => {
    it('returns the poultry', async () => {
      const mockResponse = {
        ok: true,
        poultry: {},
        message: 'example message'
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('');

      expect(await poultryServiceClient.postPoultry(mockResponse.poultry)).toBe(mockResponse.poultry);
      expect(mockAxiosPost).toHaveBeenCalledWith('/poultries', mockResponse.poultry);
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

      const poultryServiceClient = new PoultryServiceClient('');

      expect(await poultryServiceClient.postPoultry({})).toBe(mockResponse.error);
    });
  });

  describe('.postPoultryUser', () => {
    it('returns the poultry user', async () => {
      const mockResponse = {
        ok: true,
        poultryUser: {
          poultryId: 'id',
          userId: 'id'
        },
        message: 'example message'
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('');

      expect(await poultryServiceClient.postPoultryUser(mockResponse.poultryUser)).toBe(mockResponse.poultryUser);
      expect(mockAxiosPost).toHaveBeenCalledWith(`/poultries/${mockResponse.poultryUser.poultryId}/users`, { userId: mockResponse.poultryUser.userId });
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

      const poultryServiceClient = new PoultryServiceClient('');

      expect(await poultryServiceClient.postPoultryUser({})).toBe(mockResponse.error);
    });
  });
});
