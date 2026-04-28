type SearchbarProps = {
  searchKey: string ;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
};
function Searchbar({searchKey, setSearchKey} : SearchbarProps) {


  return (
    <div className="search-bar">
      <input type="text" placeholder="Search Conversations" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
      <div className="search-button">
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  );
}

export default Searchbar;
