// This is a trigger comment for deployment pipeline
import React, { useEffect, useState } from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useNavigate } from "react-router-dom";
import { apiService, Category } from "../../config/api";

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
    <TreeItem
      key={nodes._id}
      itemId={nodes._id}
      label={
        <span
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            // Prevent navigation if the click is on the expand/collapse icon
            if (
              (e.target as HTMLElement).closest(".MuiTreeItem-iconContainer")
            ) {
              return;
            }
            e.stopPropagation();
            navigate(`/categories/${nodes._id}`);
          }}>
          {nodes.name}
        </span>
      }>
      {nodes.children.map((node) => renderTree(node))}
    </TreeItem>
  );

  if (loading) return <div>Loading categories...</div>;

  return (
    <SimpleTreeView>{tree.map((node) => renderTree(node))}</SimpleTreeView>
  );
};

export default CategoryTree;
