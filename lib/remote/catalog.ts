import { logError, logInfo } from "../../common/logger";
import Api from "./api";
import Mock from "./mock";
import Product from "../models/InventoryCatalog";
const InventoryService = {
  loadProducts: (offset, limit): Promise<{ products: Product[], info: any}> =>
    new Promise((resolve, reject) => {
        Api.get(`inventory/products/?offset=${offset}&limit=${limit}`)
        .then(res => {
          logInfo("inventory response: " + res);
          resolve({products: res.data.payload, info: res.data.message});
        })
        .catch(err => {
          if (err.status === 404) {
            return reject("404: account not found");
          }
          if (err.status === 403) {
            return reject("403: password mismatch");
          } else if (err.status === 422) {
            logError(err);
            return resolve({products: Mock.products, info: "loaded from mock"});
          } else if (err.status === 500) {
            logError(err);
            return reject(new Error("server error"));
          }
          logError(err);
          reject(err);
        });
    }),
 
};
export default InventoryService;
