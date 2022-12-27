//make create function reactjs

import Layout from "../Layout";

import Kai from "../../components/kai/Kai";

export default function Home(){

    return(
        <Layout>
            <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <Kai />
            </div>
            </div>
        </Layout>
    )
}
