import { loginStatusObserver } from "./observer"
import { tokenStorage } from "./Storage";

interface IHttpRequestOption {
  path: string;
  method?: string;
  params?: any;
  data?: any;
  headers?: {
    [key: string]: string
  }
}

interface IHttpResponse {
  data: any
  code: number
  status: string
  message: string
  errcode?: number
  errmsg?: string
}

class HttpRequest {
  get(url: string, params?: any) {
    return this.request({
      path: url,
      params: params,
      method: 'GET'
    })
  }

  post(url: string, data?: any) {
    return this.request({
      path: url,
      data,
      method: 'POST'
    })
  }

  delete(url: string, data?: any) {
    return this.request({
      path: url,
      data,
      method: 'DELETE'
    })
  }

  put(url: string, data?: any) {
    return this.request({
      path: url,
      data,
      method: 'PUT'
    })
  }

  withToken(data: any): any {
    if(!data) data = {}
    const token = tokenStorage.get()
    if(token) {
      data = {
        ...data,
        token
      }
    }
    return data
  }

  private async request(option: IHttpRequestOption) {
    const fetchOption: any = {
      method: option.method,
      // credentials: 'include',
      headers: {
        ...(option.headers || {})
      }
    };
    let url = CHARITY_PUBLIC_API_HOST + option.path.replace(/^\/api/, '');

    // token 导入
    const token = tokenStorage.get()
    if(token) {
      fetchOption.headers['Authorization'] = token
    }

    if (option.method !== 'GET') {
      if (option.data) fetchOption.body = JSON.stringify(option.data)
      // body = this.serializationParams(option.data);
      fetchOption.headers['Content-Type'] = 'application/json';
    }
    if (option.params) {
      url += `?${this.serializationParams(option.params)}`;
    }
    try {
      const res = await fetch(url, fetchOption);
      const data: IHttpResponse = await res.json();
      if (data.code !== 200) {
        if(data.code === 401) {
          loginStatusObserver.emit({
            msg: data.message,
            code: data.code
          })
        }
        throw new Error(data.message || data.errmsg);
      }
      return data.data;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(`server error: ${err.message}`);
      }
      throw err;
    }
  }

  private serializationParams(params: any) {
    if (typeof (params) === 'string') {
      return params;
    }
    const arr: any[] = [];
    for (const i in params) {
      const item = params[i]
      if(item !== undefined && item !== null) {
        if (typeof item === 'string') {
          arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
        }
        else {
          arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(JSON.stringify(params[i])));
        }
      }
    }
    return arr.join('&');
  }
}

export default new HttpRequest();