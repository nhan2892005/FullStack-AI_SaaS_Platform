"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constant"
import { CustomField } from "./CustomFeild"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { set } from "mongoose"
import { addImage, updateImage } from "@/lib/actions/image.action"
import { InsufficientCreditsModal } from "./InsufficientCredits"
 
export const formSchema = z.object({
  title: z.string(),
  aspectRatioOptions: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const ImageForm = ({ 
    action, 
    data = null, 
    userId, 
    type, 
    creditBalance,
    config = null} : TransformationFormProps) => {

    const initValues = data && action === 'Update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    } : defaultValues

    const transformationType = transformationTypes[type];
    const [image, setImage] = useState(data)
    const [newTransformation, setnewTransformation] = useState<Transformations | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const onSelectField = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]
    
        setImage((prevState: any) => ({
          ...prevState,
          aspectRatio: imageSize.aspectRatio,
          width: imageSize.width,
          height: imageSize.height,
        }))
    
        setnewTransformation(transformationType.config);
    
        return onChangeField(value)
    }

    const onInputChange = (
        fieldName: string, 
        value: string, 
        type:string, 
        onChangeField: (value: string) => void) => 
    {
        debounce(() => {
            setnewTransformation((prevState: any) => ({
                ...prevState,
                [type]:{
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to'] : value
                }
            }))
        }, 1000)();
        return onChangeField(value)
    }

    const onTransformHandler = async () => {
        setIsTransforming(true)

        setTransformationConfig(
            deepMergeObjects(newTransformation, transformationConfig)
        )

        setnewTransformation(null)
        
        startTransition(async () => {
            await updateCredits(userId, creditFee)
        })
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initValues,
    })
 
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        if (data || image) {
            const transformationURL = getCldImageUrl({
                width: image?.width,
                height: image?.height,
                src: image?.publicId,
                ...transformationConfig,
            })

            const imageData = {
                title: values.title,
                publicId: image?.publicId,
                transformationType: type,
                width: image?.width,
                height: image?.height,
                config: transformationConfig,
                secureURL: image?.secureURL,
                transformationURL,
                aspectRatio: values?.aspectRatioOptions,
                color: values?.color,
                prompt: values?.prompt,
            }

            if (action === 'Add') {
                try {
                    const new_image = await addImage({
                        image: imageData,
                        userId,
                        path: '/'
                    })

                    if (new_image) {
                        form.reset()
                        setImage(data)
                        router.push(`/Transform/${new_image._id}`)
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            if (action === 'Update') {
                try {
                    const update_image = await updateImage({
                        image: {
                            ...imageData,
                            _id: data._id,
                        },
                        userId,
                        path: `/transformations/${data._id}`
                    })

                    if (update_image) {
                        router.push(`/transformations/${update_image._id}`)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (image && (type === 'restore' || type === 'remove')){
            setnewTransformation(transformationType.config)
        }
    }, [image, transformationType.config, type])

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
            <CustomField
                control={form.control}
                name="title"
                formLabel="image title"
                render={({ field }) => <Input {...field} className="input-field"/>}
            />

            {type === 'fill' && (
                <CustomField 
                    control={form.control}
                    name="aspectRatioOptions"
                    formLabel="Aspect Ratio"
                    className="w-full"
                    render={({ field }) => (
                        <Select onValueChange={(value) => onSelectField(value, field.onChange)}>
                            <SelectTrigger className="select-field">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(aspectRatioOptions).map((key) => (
                                    <SelectItem key={key} value={key} className="select-item">
                                        {aspectRatioOptions[key as AspectRatioKey].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            )}

            {(type === 'remove'|| type === 'recolor') && (
                <div className="prompt-field">
                    <CustomField 
                      control={form.control}
                      name="prompt"
                      formLabel={
                        type === 'remove' ? 'Remove background' : 'Recolor image'
                      }
                      className="w-full"
                      render={({ field }) => (
                        <Input
                            value={field.value}
                            className="input-field"
                            onChange={(e)=>onInputChange(
                                "prompt",
                                e.target.value,
                                type,
                                field.onChange

                            )}
                        />
                      )}
                    />

                    {type === 'recolor' && (
                        <CustomField 
                            control={form.control}
                            name="color"
                            formLabel="Replacement Color"
                            className="w-full"
                            render={({ field }) => (
                                <Input 
                                    value={field.value}
                                    className="input-field"
                                    onChange={(e) => onInputChange(
                                        'color',
                                        e.target.value,
                                        'recolor',
                                        field.onChange
                                    )}
                                />
                            )}
                        />
                    )}
                </div>
            )}
            
            <div className="media-uploader-field">
              <CustomField 
              control={form.control}
              name="publicId"
              className="flex size-full flex-col"
              render={({ field }) => (
                <MediaUploader 
                  onValueChange={field.onChange}
                  setImage={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
              )}
            />
            </div>

            <TransformedImage 
                image={image}
                type={type}
                title={form.getValues().title}
                transformationConfig={transformationConfig}
                isTransforming={isTransforming}
                setIsTransforming={setIsTransforming}
            />
            <div className="flex flex-col gap-4">
                <Button 
                    type="button"
                    className="submit-button capitalize"
                    disabled={isTransforming || newTransformation === null}
                    onClick={onTransformHandler}
                >
                    {isTransforming ? 'Transforming...' : 'Apply Transformation'}
                </Button>

                <Button 
                    type="submit"
                    className="submit-button capitalize"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Save Image'}
                </Button>
            </div> 
          </form>
        </Form>
    )
}

export default ImageForm