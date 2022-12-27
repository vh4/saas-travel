//make create function reactjs

import Layout from "../Layout";

import Menu from "../../components/home/Menu";

export default function Home(){

    return(
        <Layout>
            <div className="container">
            <div className="w-full px-2"> 

                {/* menu fitur  */}
                <Menu />

            </div>
            </div>
        </Layout>
    )
}
