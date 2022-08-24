/* eslint-disable @next/next/no-img-element */
import { PortableText } from "@portabletext/react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";

function Post({ post }) {
    console.log(post.body)


    const components = {
        marks: {
            link: ({ children, value }) => (
                <a href={value?.href}>{children}</a>
            )
        },
        block: {
            h1: ({children}) => 
                <h1 className="text-xl  font-bold my-5">{children}</h1>,
            h2: ({children}) => 
                <h2 className="text-lg font-bold my-5">{children}</h2>,
            h4: ({children}) => 
                <h2 className="text-lg font-bold my-5">{children}</h2>,
            blockquote: ({children}) => <blockquote className="border-l-purple-500">{children}</blockquote>,
        },
        types: {
            image : ({ value }) => 
                <img src={urlFor(value).url()} alt="image" className="h-full w-full my-4"/>
        }
    }


  return (
    <main>
        <Header />
        <img src={urlFor(post.mainImage).url()} alt="" className="w-full h-40 object-cover"/>

        <article className="max-w-3xl mx-auto p-5">
            <h1 className="text-3xl mt-10 mb-3 font-bold text-center">{post.title}</h1>
            <h2 className="text-gray-600 text-xl font-light mb-2">{post.description}</h2> 
            <div className="flex items-center space-x-2">
                <img src={urlFor(post.author.image).url()} alt="" className="h-10 w-10 rounded-full"/>
                <p className="font-extralight text-sm">
                    Blog post by {post.author.name} - Published at{" "} {new Date(post._createdAt).toLocaleDateString()}
                </p>
            </div>
       
            <div className="mt-5 break-all">
                <PortableText 
                    // dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                    // projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    // content = {post?.body}
                    // serializers = {{
                    //     h1: (props) => { 
                    //         <h1 className="text-2xl  font-bold my-5" {...props} />
                    //     },
                    //     h2: (props) => {
                    //         <h2 className="text-xl font-bold my-5" {...props} />
                    //     },
                    //     li : ({children}) => {
                    //         <li> {children}</li>
                    //     },
                    //     link : ({href,children}) => {
                    //         <a href={href}>{children}</a>
                    //     }
                    // }}
                    value={post?.body}
                    components={components}
                />
            </div>

        </article>
    </main>
  )
}

export default Post;

export const getStaticPaths = async () => { 
    const query = `*[_type == "post"]{
        _id,
        slug {
            current,
        },
    }`;
    
    const posts = await sanityClient.fetch(query);
    const paths = posts.map(post => ({
        params: {
        slug: post.slug.current,
        },
    }));
    
    return {
        paths,
        fallback: 'blocking',
    }
};

export const getStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        'comments' : *[
            _type == "comment" && 
            post.ref == ^.id && 
            approved == true],
        description,
        mainImage,
        slug,
        body,
    }`;
    
    const post = await sanityClient.fetch(query, {slug: params?.slug});
    
    if(!post){
        return {
            notFound: true,
        }
    }

    return {
        props: {
            post,
        },
        revalidate : 60,
    }
}