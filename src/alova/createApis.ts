/* tslint:disable */
/* eslint-disable */
/**
 * CodeHub API - version 1.0.0
 *
 * CodeHub 后端服务 API 文档
 *
 * OpenAPI version: 3.0.0
 *
 *
 * NOTE: This file is auto generated by the alova's vscode plugin.
 *
 * https://alova.js.org/devtools/vscode
 *
 * **Do not edit the file manually.**
 */
import type { Alova, MethodType, AlovaGenerics, AlovaMethodCreateConfig } from 'alova';
import { Method } from 'alova';
import apiDefinitions from './apiDefinitions';

const createFunctionalProxy = (array: (string | symbol)[], alovaInstance: Alova<AlovaGenerics>, configMap: any) => {
  // create a new proxy instance
  return new Proxy(function () {}, {
    get(_, property) {
      // record the target property, so that it can get the completed accessing paths
      array.push(property);
      // always return a new proxy to continue recording accessing paths.
      return createFunctionalProxy(array, alovaInstance, configMap);
    },
    apply(_, __, [config]) {
      const apiPathKey = array.join('.') as keyof typeof apiDefinitions;
      const apiItem = apiDefinitions[apiPathKey];
      if (!apiItem) {
        throw new Error(`the api path of \`${apiPathKey}\` is not found`);
      }
      const mergedConfig = {
        ...configMap[apiPathKey],
        ...config
      };
      const [method, url] = apiItem;
      const pathParams = mergedConfig.pathParams;
      const urlReplaced = url.replace(/\{([^}]+)\}/g, (_, key) => {
        const pathParam = pathParams[key];
        return pathParam;
      });
      delete mergedConfig.pathParams;
      let data = mergedConfig.data;
      if (Object.prototype.toString.call(data) === '[object Object]' && typeof FormData !== 'undefined') {
        let hasBlobData = false;
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
          if (data[key] instanceof Blob) {
            hasBlobData = true;
          }
        }
        data = hasBlobData ? formData : data;
      }
      return new Method(method.toUpperCase() as MethodType, alovaInstance, urlReplaced, mergedConfig, data);
    }
  });
};

export const createApis = (alovaInstance: Alova<AlovaGenerics>, configMap: any) => {
  const Apis = new Proxy({} as Apis, {
    get(_, property) {
      return createFunctionalProxy([property], alovaInstance, configMap);
    }
  });
  // define global variable `Apis`
  (globalThis as any).Apis = Apis;
  return Apis;
};
type MethodConfig<T> = AlovaMethodCreateConfig<
  (typeof import('./index'))['alovaInstance'] extends Alova<infer AG> ? AG : any,
  any,
  T
>;
type APISofParameters<Tag extends string, Url extends string> = Tag extends keyof Apis
  ? Url extends keyof Apis[Tag]
    ? Apis[Tag][Url] extends (...args: any) => any
      ? Parameters<Apis[Tag][Url]>
      : any
    : any
  : any;
type MethodsConfigMap = {
  [P in keyof typeof import('./apiDefinitions').default]?: MethodConfig<
    P extends `${infer Tag}.${infer Url}` ? Parameters<APISofParameters<Tag, Url>[0]['transform']>[0] : any
  >;
};
export const withConfigType = <Config extends MethodsConfigMap>(config: Config) => config;
