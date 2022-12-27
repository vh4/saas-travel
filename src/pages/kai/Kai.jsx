//make create function reactjs

import Layout from "../Layout";

import Menu from "../../components/plane/Plane";

export default function Home(){

    return(
        <Layout>
            <div className="container">
            <div className="w-full px-4"> 

                {/* menu fitur  */}
                <Menu />

            </div>
            </div>
        </Layout>
    )
}
