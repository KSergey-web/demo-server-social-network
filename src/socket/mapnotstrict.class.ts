import { consoleOut } from 'src/debug';

export interface Item {
  key: string;
  value: string;
}
export class MapNotStrict {
  items: Array<Item> = [];

  lenght(): number {
    return this.items.length;
  }

  set(key: string, value: string): Item {
    key = key.toString();
    value = value.toString();
    const ind = this.items.findIndex(item => {
      return item.key == key;
    });
    if (ind != -1) {
      this.items[ind].value = value;
      return this.items[ind];
    } else {
      let len = this.items.push({ key, value });
      return this.items[len - 1];
    }
  }

  delete(key: string) {
    key = key.toString();
    const ind = this.items.findIndex(item => {
      return item.key == key;
    });
    if (ind != -1) {
      this.items.splice(ind, 1);
      return true;
    } else return false;
  }

  has(key: string) {
    key = key.toString();
    const ind = this.items.findIndex(item => {
      return item.key == key;
    });
    if (ind != -1) {
      return true;
    } else return false;
  }

  get(key: string): Item | undefined {
    key = key.toString();
    const item = this.items.find(item => {
      return item.key == key;
    });
    return item;
  }

  deleteByValue(value: string): boolean {
    value = value.toString();
    const ind = this.items.findIndex(item => {
      return item.value == value;
    });
    if (ind != -1) {
      this.items.splice(ind, 1);
      return true;
    } else return false;
  }
}
