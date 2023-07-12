import axios from "axios";
import { Product } from "./types";
const Papa = require('papaparse')

export default {
    list: async (): Promise<Product[]> => {
        try {
            const response = await axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vRrO2Vt3thB9DYQL6fpVBRA-lJAPgO9kNRAClQDhUrQa7RMM-YTLsyfRQkMNJELE8apKtzo-ikffrhQ/pub?output=csv", 
            {
                responseType: "blob",
            });
            const results = await new Promise<{ data: Product[] }>((resolve, reject) => {
                Papa.parse(response.data, {
                    header: true,
                    complete: (results: { data: Product[] }) => {
                        resolve(results);
                    },
                    error: (error: { message: any }) => {
                        reject(error.message);
                    },
                });
            });
            const products = results.data as Product[];
            return products.map((product) => ({
                ...product,
                precio: Number(product.precio),
            }));
        } catch (error) {
            throw new Error(`Error fetching or parsing data: ${error}`);
        }
    }

}