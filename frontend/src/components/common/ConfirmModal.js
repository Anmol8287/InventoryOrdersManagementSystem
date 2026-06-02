import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmModal({ open, title, message, onClose, onConfirm, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <p className="text-sm text-slate-300">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Deleting..." : "Delete"}</Button>
      </div>
    </Modal>
  );
}
