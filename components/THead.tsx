"use client";

interface TheadProps {
  sortField: string;
  sortOrder: string;
  handleSort: (field: string) => void;
  options: {
    label: string;
    field: string;
    isSortable: boolean;
  }[];
}

export default function Thead({
  sortField,
  sortOrder,
  handleSort,
  options,
}: TheadProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };
  return (
    <tr>
      {options.map((option) => (
        <th
          key={option.field}
          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
            option.isSortable ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (option.isSortable) {
              handleSort(option.field);
            }
          }}
        >
          {option.label} {getSortIcon(option.field)}
        </th>
      ))}
    </tr>
  );
}
