import Navbar from "../components/Navbar"
import Memories from "../components/Memories";

const Home = () => {
  return (
    <div>
      <Navbar linkHref={'/create'} linkText={'Create Memory'}/> 
      <Memories />
    </div>
  );
};

export default Home;


