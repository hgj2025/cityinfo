
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div id="confirm-delete-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-text-primary mb-3">确认取消收藏</h3>
        <p className="text-text-secondary mb-6">您确定要取消收藏此项目吗？此操作无法撤销。</p>
        <div className="flex justify-end space-x-3">
          <button 
            id="cancel-delete" 
            className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50"
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            id="confirm-delete" 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onConfirm}
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;