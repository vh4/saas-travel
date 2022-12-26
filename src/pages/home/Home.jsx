//make create function reactjs

import Layout from "../Layout";

import Carousels from '../../components/home/Carousel'
import Menu from "../../components/home/Menu";

export default function Home(){

    return(
        <Layout>
            <div className="px-2 md:px-12"> 

                {/* menu fitur  */}
                <Menu />

                {/* carousel fitur  */}
                <Carousels />

            </div>
        </Layout>
    )
}
