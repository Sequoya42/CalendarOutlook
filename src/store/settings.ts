import { get, writable, type Writable } from "svelte/store";

let categories = writable([]);
let filterByCat = writable('')

export {
  categories,
  filterByCat
}