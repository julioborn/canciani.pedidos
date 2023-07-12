import React from 'react'
import { ChakraProvider, Container, VStack, Image, Box, Divider, Text } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import theme from '../theme'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        {/* @ts-ignore */}
        <Container backgroundColor="white" boxShadow="md" maxWidth="container.xl" padding={4} borderRadius="sm" >
          <VStack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Image width={250} src="https://res.cloudinary.com/dwz4lcvya/image/upload/v1680286583/logo_lwomhc.jpg"></Image>
            <Text as='b' fontSize='3xl' sx={{display: "flex", justifyContent: "center"}}></Text>
          </VStack>
          <Divider marginY={4} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App