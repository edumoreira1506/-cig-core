import axios from 'axios';
import faker from '@faker-js/faker';

import PoultryServiceClient from '@Clients/PoultryServiceClient';
import { breederFactory, poultryFactory } from '@cig-platform/factories';

describe('PoultryServiceClient', () => {
  describe('.postBreeder', () => {
    it('returns the breeder', async () => {
      const mockResponse = {
        ok: true,
        breeder: {},
        message: 'example message'
      };
      const mockAxiosPost = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        post: mockAxiosPost
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.postBreeder(mockResponse.breeder)).toBe(mockResponse.breeder);
      expect(mockAxiosPost).toHaveBeenCalledWith('/v1/breeders', mockResponse.breeder);
    });
  });

  describe('.postBreederUser', () => {
    it('returns the breeder user', async () => {
      const mockResponse = {
        ok: true,
        breederUser: {
          breederId: 'id',
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

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.postBreederUser(mockResponse.breederUser)).toBe(mockResponse.breederUser);
      expect(mockAxiosPost).toHaveBeenCalledWith(`/v1/breeders/${mockResponse.breederUser.breederId}/users`, { userId: mockResponse.breederUser.userId });
    });
  });

  describe('.getBreeders', () => {
    it('returns all breeders', async () => {
      const mockResponse = {
        ok: true,
        breeders: []
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.getBreeders()).toBe(mockResponse.breeders);
      expect(mockAxiosGet).toHaveBeenCalledWith('/v1/breeders', { params: {} });
    });

    it('sends userId as query param', async () => {
      const userId = faker.datatype.uuid();
      const mockResponse = {
        ok: true,
        breeders: []
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.getBreeders(userId)).toBe(mockResponse.breeders);
      expect(mockAxiosGet).toHaveBeenCalledWith('/v1/breeders', { params: { userId } });
    });
  });

  describe('.getBreeder', () => {
    it('returns the breeder', async () => {
      const mockResponse = {
        ok: true,
        breeder: {
          id: 'fake-id'
        },
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.getBreeder(mockResponse.breeder.id)).toBe(mockResponse.breeder);
      expect(mockAxiosGet).toHaveBeenCalledWith(`/v1/breeders/${mockResponse.breeder.id}`);
    });
  });

  describe('.updateBreeder', () => {
    it('calls .patch', async () => {
      const breeder = breederFactory();
      const mockAxiosPatch = jest.fn();
      const mockAxiosCreate = jest.fn().mockReturnValue({
        patch: mockAxiosPatch
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      await poultryServiceClient.updateBreeder(breeder.id, breeder);

      expect(mockAxiosPatch).toHaveBeenCalled();
    });
  });

  describe('.getBreederImages', () => {
    it('returns all images', async () => {
      const breeder = breederFactory();
      const mockResponse = {
        ok: true,
        breederImages: []
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.getBreederImages(breeder.id)).toBe(mockResponse.breederImages);
      expect(mockAxiosGet).toHaveBeenCalledWith(`/v1/breeders/${breeder.id}/images`);
    });
  });

  describe('.getPoultry', () => {
    it('returns poultry', async () => {
      const poultry = poultryFactory();
      const breeder = breederFactory();
      const mockResponse = {
        ok: true,
        poultry
      };
      const mockAxiosGet = jest.fn().mockResolvedValue({
        data: mockResponse
      });
      const mockAxiosCreate = jest.fn().mockReturnValue({
        get: mockAxiosGet
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      expect(await poultryServiceClient.getPoultry(breeder.id, poultry.id)).toBe(mockResponse.poultry);
      expect(mockAxiosGet).toHaveBeenCalledWith(`/v1/breeders/${breeder.id}/poultries/${poultry.id}`);
    });
  });

  describe('.updatePoultry', () => {
    it('calls .patch', async () => {
      const poultry = poultryFactory();
      const breeder = breederFactory();
      const mockAxiosPatch = jest.fn();
      const mockAxiosCreate = jest.fn().mockReturnValue({
        patch: mockAxiosPatch
      });

      jest.spyOn(axios, 'create').mockImplementation(mockAxiosCreate);

      const poultryServiceClient = new PoultryServiceClient('', '');

      await poultryServiceClient.updatePoultry(breeder.id, poultry.id, poultry);

      expect(mockAxiosPatch).toHaveBeenCalledWith(`/v1/breeders/${breeder.id}/poultries/${poultry.id}`, poultry);
    });
  });
});
