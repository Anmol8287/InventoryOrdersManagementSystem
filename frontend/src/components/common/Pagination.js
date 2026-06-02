import Button from "./Button";

export default function Pagination({ page, pageSize, count, onPageChange }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  return (
    <div className="flex items-center justify-between gap-3 pt-4 text-sm text-slate-300">
      <span>Page {page} of {pages}</span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <Button variant="secondary" disabled={page === pages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
