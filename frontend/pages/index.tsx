import HomepageDescription from "../components/HomepageDescription";
import Navbar from "../components/Navbar"
import Memories from "./Memories";

const Home = () => {
  return (
    <div>
      <Navbar linkHref={'/create'} linkText={'Create Memory'}/> 
      <HomepageDescription />
      <Memories />
    </div>
  );
};

export default Home;
 