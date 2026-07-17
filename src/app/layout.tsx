import "./globals.css";

export const metadata = {
 title:"FotoEduc",
 description:"Plataforma profissional de venda e entrega de fotos"
};


export default function RootLayout({
children,
}:{
children:React.ReactNode
}){

return(

<html lang="pt-BR">

<body>

{children}

</body>

</html>

)

}
