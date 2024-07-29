import Header from '@/components/share/Header'
import ImageForm from '@/components/share/ImageForm';
import { transformationTypes } from '@/constant'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const AddTransformType = async ({ params : { type }}: SearchParamProps) => {
  const { userId } = auth();
  console.log('userId', userId);
  console.log(auth());
  const transformType = transformationTypes[type];

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);

  return (
    <>
      <Header title={transformType.title}
            subtitle={transformType.subTitle}
      />
      <section className='mt-10'>
        <ImageForm 
          action="Add"
          userId={user._id}
          type={transformType.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformType