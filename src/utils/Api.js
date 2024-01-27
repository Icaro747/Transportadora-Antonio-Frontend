import axios from "axios";

class Api {
  constructor(Logoff) {
    this.logout = Logoff !== undefined ? Logoff : () => { };
    this.baseURL = process.env.REACT_APP_API_URL;
  }

  async Get({ url, endpoint, params, config }) {
    try {
      if (url !== undefined) {
        const response = await axios.get(url);
        return response.data;
      }
      if (params !== undefined) {
        let query = "";
        const nameParams = Object.getOwnPropertyNames(params);

        nameParams.forEach((item, i) => {
          if (i === 0) {
            query = `?${item}=${params[item]}`;
          } else {
            query += `&${item}=${params[item]}`;
          }
        });

        const response = await axios.get(
          `${this.baseURL}${endpoint}${query}`,
          config
        );
        return response.data;
      }

      const response = await axios.get(`${this.baseURL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        return null;
      }
      throw error;
    }
  }

  async Post({ endpoint, data, config }) {
    try {
      const response = await axios.post(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        return null;
      }
      throw error;
    }
  }

  async Put({ endpoint, data, config }) {
    try {
      const response = await axios.put(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        return null;
      }
      throw error;
    }
  }

  async Delete({ endpoint, params, config }) {
    try {
      if (params !== undefined) {
        let query = "";
        const nameParams = Object.getOwnPropertyNames(params);

        nameParams.forEach((item, i) => {
          if (i === 0) {
            query = `?${item}=${params[item]}`;
          } else {
            query += `&${item}=${params[item]}`;
          }
        });

        const response = await axios.delete(
          `${this.baseURL}${endpoint}${query}`,
          config
        );
        return response.data;
      }
      const response = await axios.delete(`${this.baseURL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        return null;
      }
      throw error;
    }
  }
}

export default Api;
