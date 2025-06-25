// This is a trigger comment for deployment pipeline
import React, { useEffect, useState } from "react";
// @ts-expect-error MUI X TreeView v8: missing type declarations for TreeView
import TreeView from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useNavigate } from "react-router-dom";
import { apiService, Category } from "../../config/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function buildCategoryTree(
  categories: Category[],
  parent: string | null = null,
): CategoryNode[] {
  return categories
    .filter((cat) => cat.parent === parent)
    .map((cat) => ({
      ...cat,
      children: buildCategoryTree(categories, cat._id),
    }));
}

const CategoryTree: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getAllCategories().then((cats) => {
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const tree = buildCategoryTree(categories);

  const renderTree = (nodes: CategoryNode) => (
    <TreeItem key={nodes._id} itemId={nodes._id} label={nodes.name}>
      {nodes.children.map((node) => renderTree(node))}
    </TreeItem>
  );

  if (loading) return <div>Loading categories...</div>;

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onItemClick={(_event: React.MouseEvent, id: string) =>
        navigate(`/categories/${id}`)
      }>
      {tree.map((node) => renderTree(node))}
    </TreeView>
  );
};

export default CategoryTree;
