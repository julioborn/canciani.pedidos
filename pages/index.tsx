import React, { useState } from 'react';
import {
  Button,
  Grid,
  Stack,
  Text,
  Link,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import api from '../product/api';
import { Product } from '../product/types';
import { GetStaticProps } from 'next';
import swal from 'sweetalert';

interface Props {
  products: Product[];
}

const Home: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const [expandedImage, setExpandedImage] = useState('');
  const [productQuantities, setProductQuantities] = useState<{ [productId: string]: number }>({});

  {/** -----  Manejo del carrito  ----- */ }
  const handleQuantityChange = (productId: string, value: string) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: parseInt(value)
    }));
  };
  const handleAddToCart = (product: Product) => {
    const quantity = productQuantities[product.id] || 0;
    const productsToAdd = Array(quantity).fill(product);
    if (quantity === 0) {
      swal("No tienes ningun producto seleccionado", "Sigue viendo más productos", "error");
    } else {
      setCart((cart) => [...cart, ...productsToAdd]);
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: 0
      }));
      swal("Producto agregado", "Sigue viendo más productos", "success");
    }
  };

  {/** -----  Expansion de imagenes  ----- */ }
  const handleImageClick = (src: string) => {
    setExpandedImage(src);
  };
  const closeExpandedImage = () => {
    setExpandedImage('');
  };

  {/** -----  Mensaje de compra  ----- */ }
  const text = React.useMemo(() => {
    const productCount = cart.reduce(
      (countMap, product) => {
        if (countMap.has(product.producto)) {
          // @ts-ignore
          countMap.set(product.producto, countMap.get(product.producto) + 1);
        } else {
          countMap.set(product.producto, 1);
        }
        return countMap;
      },
      new Map<string, number>()
    );
    let message = '';
    // @ts-ignore
    for (const [producto, cantidad] of productCount.entries()) {
      message += `* ${producto} (${cantidad} unidades)\n`;
    }
    return message;
  }, [cart]);

  return (
    <Stack spacing={6}>
      <Grid gridGap={3} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
        {products.map((product) => (
          <Stack borderRadius="md" padding={4} backgroundColor="gray.200" key={product.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              maxWidth="200px"
              maxHeight="300px"
              objectFit="contain"
              borderRadius="4"
              src={product.imagen}
              onClick={() => handleImageClick(product.imagen)}
              cursor="pointer"
            />
            <Text as='b' sx={{ display: 'flex', justifyContent: 'center' }}>{product.producto}</Text>
            {/*<Text>$ {product.precio}</Text>*/}
            <Stack backgroundColor="white" borderRadius="7px">
              <NumberInput size='lg' maxW={24} defaultValue={0} min={0}
                value={productQuantities[product.id] || '0'}
                onChange={(value) => handleQuantityChange(product.id, value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
            <Button colorScheme="primary" backgroundColor="red.500" color="white" width="95%"
              onClick={() => handleAddToCart(product)}>
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      <Modal isOpen={!!expandedImage} onClose={closeExpandedImage}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={expandedImage} borderRadius="md" mb="9" />
          </ModalBody>
        </ModalContent>
      </Modal>
      {Boolean(cart.length) && (
          <Flex position="sticky" bottom={16} justifyContent="center" alignItems="center">
            {/* @ts-ignore */}
            <Button
              width="500px"
              colorScheme="green"
              as={Link}
              isExternal
              href={`https://wa.me/3483521462?text=${encodeURIComponent(text)}`}
            >
              Completar pedido
            </Button>
          </Flex>
      )}
      {Boolean(cart.length) && (
        <Flex position="sticky" bottom={6} justifyContent="center" alignItems="center">
          <Button width="500px" colorScheme="red" backgroundColor="red" color="white"
            onClick={() => setCart([])}>
            Cancelar pedido
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default Home;
