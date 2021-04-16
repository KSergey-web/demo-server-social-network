import { MapNotStrict } from "./mapnotstrict.class";

describe('usersOnline', () => {

  beforeEach(async () => {


  });

  it('should set if key not exist', () => {
    let usersOnline: MapNotStrict = new MapNotStrict();
    let user = {
      id: 'id',
      soc: 'soc'
    }
    expect(usersOnline.set(user.id, user.soc)).toEqual({
      key: user.id,
      value: user.soc,
    });
  });

  it('should set if key exist', () => {
    let usersOnline: MapNotStrict = new MapNotStrict();
    let user = {
      id: 'id',
      soc: 'soc'
    }
    expect(usersOnline.set(user.id, user.soc)).toEqual({
      key: user.id,
      value: user.soc,
    });
    expect(usersOnline.lenght()).toBe(1);
    expect(usersOnline.set(user.id, 'soc2')).toEqual({
      key: user.id,
      value: 'soc2',
    });
    expect(usersOnline.lenght()).toBe(1);
  });

  it('should get if key exist', () => {
    let usersOnline: MapNotStrict = new MapNotStrict();
    let user = {
      id: 'id',
      soc: 'soc'
    }
    expect(usersOnline.set(user.id, user.soc)).toEqual({
      key: user.id,
      value: user.soc,
    });
    expect(usersOnline.lenght()).toBe(1);
    expect(usersOnline.get('id')).toEqual({
      key: user.id,
      value: user.soc,
    });
    expect(usersOnline.get('id2')).toEqual(undefined);
  });

  describe('has', () => {
    it('should return true if no element', () => {
      let usersOnline: MapNotStrict = new MapNotStrict();
      let user = {
        id: 'id',
        soc: 'soc'
      }
      expect(usersOnline.set(user.id, user.soc)).toEqual({
        key: user.id,
        value: user.soc,
      });
      expect(usersOnline.has(user.id)).toEqual(true);
      expect(usersOnline.has('af')).toEqual(false);
    });
  })

  describe('delete', () => {
    it('should delete', () => {
      let usersOnline: MapNotStrict = new MapNotStrict();
      let user = {
        id: 'id',
        soc: 'soc'
      }
      expect(usersOnline.set(user.id, user.soc)).toEqual({
        key: user.id,
        value: user.soc,
      });
      expect(usersOnline.lenght()).toBe(1);
      expect(usersOnline.delete(user.id)).toEqual(true);
      expect(usersOnline.lenght()).toBe(0);
      expect(usersOnline.delete(user.id)).toEqual(false);
      expect(usersOnline.lenght()).toBe(0);
    });
  })

  describe('delete by value', () => {
    it('should delete', () => {
      let usersOnline: MapNotStrict = new MapNotStrict();
      let user = {
        id: 'id',
        soc: 'soc'
      }
      expect(usersOnline.set(user.id, user.soc)).toEqual({
        key: user.id,
        value: user.soc,
      });
      expect(usersOnline.lenght()).toBe(1);
      expect(usersOnline.deleteByValue(user.soc)).toEqual(true);
      expect(usersOnline.lenght()).toBe(0);
      expect(usersOnline.delete(user.id)).toEqual(false);
      expect(usersOnline.lenght()).toBe(0);
    });
  })
});