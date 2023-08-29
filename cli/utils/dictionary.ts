export default class Dictionary {
    private items = {}

    set(key, value) { // 向字典中添加或修改元素
        this.items[key] = value;
    }

    get(key) { // 通过键值查找字典中的值
        return this.items[key];
    }

    delete(key) { // 通过使用键值来从字典中删除对应的元素
        if (this.has(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    has(key) { // 判断给定的键值是否存在于字典中
        return this.items.hasOwnProperty(key);
    }

    clear() { // 清空字典内容
        this.items = {};
    }

    size() { // 返回字典中所有元素的数量
        return Object.keys(this.items).length;
    }

    keys() { // 返回字典中所有的键值
        return Object.keys(this.items);
    }

    values() { // 返回字典中所有的值
        return Object.values(this.items);
    }

    getItems() { // 返回字典中的所有元素
        return this.items;
    }
}