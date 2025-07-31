// import { useQuery } from "@tanstack/react-query"
// import { urlBase } from "../../config/globalConfig"
// import { useEffect } from "react"

// export default function Fetching() {
//     useEffect(() => {
//         async function fetchData() {
//             const response = await fetch(`${urlBase}/pharmacies`)
//             if (!response.ok) {
//                 throw new Error('Falolo la obtenciond edatos')
//             }
//             const data = await response.json()
//             console.log(data)
//         }

//         fetchData();
//     }, []);
//     return (
//         <div>
//             {/* <span>{JSON.stringify(data, null, 2)}</span> */}
//         </div>
//     )
// }