import { RESTDataSource } from 'apollo-datasource-rest';

export class JSONPlaceholder extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  async getComments() {
    return this.get('comments');
  }

  async getComment(id) {
    const result = await this.get(`comments/${id}`);

    if (result.length)
      return result[0];
    else
      return null;
  }
};