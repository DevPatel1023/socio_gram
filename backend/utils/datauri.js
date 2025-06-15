// A Data URI embeds file data directly inside a URL using base64 encoding.
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...


import DataUriParser from "datauri/parser.js";
import path from "path";


const getDataUri = (file) =>{
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer).content;
};
export default getDataUri;