import React, { useEffect } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { HELIUS_ENDPOINT, IMAGES } from '@/lib/config'
import useStage from '@/hooks/use-stage'
import { useSelectSticker } from '@/hooks/use-selected-sticker'
import { computeStickerURI } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

interface EditStickerButtonGroupProps {
  shown: boolean
}

export default function PickedStickerButtonGroup({ shown }: EditStickerButtonGroupProps) {
  const bottom = useSharedValue(0)
  const opacity = useSharedValue(0)
  const { setStage } = useStage()
  const { selectedSticker, transform, setSelectedSticker } = useSelectSticker()
  const { user, createSticker } = useUser()

  useEffect(() => {
    bottom.value = withSpring(shown ? 0 : -150, {
      damping: 20,
      stiffness: 200,
    })

    opacity.value = withSpring(shown ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    })
  }, [shown])

  useEffect(() => {
    console.log(transform)
  }, [transform])

  const mint = async () => {
    if (!user) return

    try {
      // await fetch(HELIUS_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     jsonrpc: '2.0',
      //     id: 'stickers-v1',
      //     method: 'mintCompressedNft',
      //     params: {
      //       name: `Sticker by @${user?.handle}`,
      //       symbol: 'STKS',
      //       owner: user?.wallet,
      //       description: `A sticker by @${user?.handle}.`,
      //       attributes: [
      //         {
      //           trait_type: 'Position',
      //           value: ``,
      //         },
      //         {
      //           trait_type: 'Scale',
      //           value: 'Infinite',
      //         },
      //       ],
      //       imageUrl: computeStickerURI(selectedSticker),
      //       sellerFeeBasisPoints: 5000,
      //     },
      //   }),
      // })

      await createSticker({
        id: selectedSticker.split('.')[0],
        owner: user.wallet,
        ...transform,
      })
      setStage('normal')
      setSelectedSticker('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Animated.View
      style={{
        bottom,
        opacity,
      }}
      className="absolute bottom-[-150px] flex w-full flex-row items-center justify-between p-9 px-9"
    >
      <TouchableOpacity onPress={() => setStage('normal')} className="relative h-[70px] w-[100px]">
        <Image
          className="h-full w-full"
          source={IMAGES.nope}
          placeholder={blurhash}
          contentFit="contain"
          transition={1000}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={mint} className="h-100px] w-[100px]">
        <Image
          className="h-full w-full"
          source={IMAGES.mint}
          placeholder={blurhash}
          contentFit="contain"
          transition={1000}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}
