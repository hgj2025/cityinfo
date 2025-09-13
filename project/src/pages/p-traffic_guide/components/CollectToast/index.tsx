
const CollectToast = () => {
  return (
    <div id="collect-toast" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center">
        <i className="fas fa-check-circle mr-2"></i>
        <span>收藏成功</span>
      </div>
    </div>
  );
};

export default CollectToast;