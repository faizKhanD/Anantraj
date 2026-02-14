import { getPresignedUrl } from "./s3";

export const attachSignedUrls= async function (record: any) {
  const data = { ...record };

  if (data.image) {
    data.image = await getPresignedUrl(data.image);
  }
  return data;
}


export const buildHierarchy = (items: any[], filterTitle?: number, filterParentId?: number): any[] => {
  const map: Record<number, any> = {};
  const roots: any[] = [];

  // Step 1: Create nodes
  items.forEach(item => {
    map[item.id] = { ...item, children: [], filters: [] };
  });

  // Step 2: Build hierarchy
  items.forEach(item => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  // Step 3: Collect all filters BEFORE applying filter
  const collectFilters = (node: any): string[] => {
    let titles: string[] = [];
    node.children.forEach((child: any) => {
      if(child.year != null){
        titles.push(child.year);
      }
        titles = titles.concat(collectFilters(child));
    });
    node.filters = [...new Set(titles)]; // store distinct titles
    return titles;
  };
  roots.forEach(root => collectFilters(root));

  console.log('Filete',roots);

  // Step 4: Apply filter only to children of filterParentId
  if (filterParentId && filterTitle) {
    const filterChildrenByParent = (node: any) => {
      if (node.id == filterParentId) {
        node.children = node.children.filter((child: any) => child.year == filterTitle);
      } else {
        node.children.forEach((child: any) => filterChildrenByParent(child));
      }
    };
    roots.forEach(root => filterChildrenByParent(root));
  }

  return roots;
};
 