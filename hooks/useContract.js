import { ethers } from "ethers"
import { contractAddresses, m3taDaoAbi } from "../constants/"
import { useAccount, useSigner } from "wagmi"
import { uploadFileToIpfs, uploadJsonToIpfs } from "../utils/uploadToIpfs"

const isJsonEmpty = (jsonObj) => {
    return (
        jsonObj &&
        Object.keys(jsonObj).length === 0 &&
        Object.getPrototypeOf(jsonObj) === Object.prototype
    )
}

const useContract = () => {
    const { data: signer, isError, isLoading } = useSigner()
    const { address } = useAccount()

    const createLensProfile = async (
        userAddress,
        handle,
        image,
        banner,
        // followNFTURI,
        description,
        designation,
        github,
        twitter,
        website,
        interests,
        skills
        // profileURI
    ) => {
        const externalJson = { website, twitter, github, interests, skills, designation }
        let externalURIs
        if (isJsonEmpty(externalJson)) {
            externalURIs = ""
        } else {
            externalURIs = await uploadJsonToIpfs(externalJson, "json")
        }
        console.log("externalURIs", externalURIs)

        let profileURI
        if (banner) {
            profileURI = await uploadFileToIpfs(banner, "image")
        } else {
            profileURI = ""
        }
        console.log("profileURI", profileURI)

        let imageURI
        if (image) {
            imageURI = await uploadFileToIpfs(image, "image")
        } else {
            imageURI = ""
        }

        console.log("imageURI", imageURI)
        const followNFTURI = ""
        console.log(signer)
        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        var tx = await m3taDaoContractInstance.createLensProfile(
            [
                [
                    userAddress,
                    handle,
                    imageURI,
                    "0x0000000000000000000000000000000000000000",
                    "0x",
                    followNFTURI,
                ],
                ["", 0, "", description, externalURIs, profileURI],
            ],
            { gasLimit: 5000000 }
        )
        return await tx.wait()
    }

    const createProjectAccount = async (
        accountName,
        website, // website url
        AccountType,
        requirements, // for now empty string
        image,
        bannerURI, // for now empty string
        description,
        // we should add into the members the contract address of metadao to be able to make updates
        members
    ) => {
        let imageURI
        if (image) {
            imageURI = await uploadFileToIpfs(image, "image")
        } else {
            imageURI = ""
        }
        const externalJson = { website, description, accountName, imageURI }
        const metaURI = await uploadJsonToIpfs(externalJson, "json")

        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        // const accountStruct = [
        //     (founderAddress = "0x0000000000000000000000000000000000000000"),
        //     (id = "0"),
        //     (accountID = "0"),
        //     (accountHex = "a"),
        //     accountName,
        //     metaURI,
        //     AccountType,
        //     requirements,
        //     imageURI,
        //     bannerURI,
        //     (metadataTable = "a"),
        //     description,
        //     // we should add into the members the contract address of metadao to be able to make updates
        //     members,
        // ]

        const accountStruct = [
            address,
            "0",
            "0",
            "a",
            accountName,
            metaURI,
            AccountType,
            requirements,
            imageURI,
            "",
            "a",
            description,
            // we should add into the members the contract address of metadao to be able to make updates
            [...members, contractAddresses.m3taDao],
        ]
        var tx = await m3taDaoContractInstance.createProjectAccount(accountStruct, {
            gasLimit: 5000000,
        })

        return await tx.wait()
    }

    const createSubProject = async (
        accountID,
        projectName,
        projectType,
        image,
        description,
        // we should add into the members the contract address of metadao to be able to make updates
        members,
        displayName,
        website,
        shortDescription,
        youTubeLink,
        tags
    ) => {
        let imageURI
        if (image) {
            imageURI = await uploadFileToIpfs(image, "image")
        } else {
            imageURI = ""
        }

        const metaURIObject = { displayName, description, website, youTubeLink, tags }
        const metaURI = await uploadJsonToIpfs(externalJson, "json")
        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        // const ProjectStruct = [
        //     (sender = "0x0000000000000000000000000000000000000000"),
        //     (id = 0),
        //     accountID,
        //     (projectID = "1"),
        //     (metadataTable = "a"),
        //     (projectHex = "e"),
        //     projectName,
        //     metaURI,
        //     projectType,
        //     imageURI,
        //     description,
        //     members,
        // ]

        const ProjectStruct = [
            address,
            "0",
            accountID,
            "1",
            "a",
            "e",
            projectName,
            metaURI,
            projectType,
            imageURI,
            shortDescription,
            [...members, contractAddresses.m3taDao],
        ]

        var tx = await m3taDaoContractInstance.createSubProject(ProjectStruct, {
            gasLimit: 5000000,
        })
        return await tx
    }

    const createRelease = async (
        projectID,
        releaseName,
        metaURI,
        releaseType,
        imageURI,
        description,
        releaseURI
    ) => {
        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        const ReleaseStruct = [
            (sender = "0x0000000000000000000000000000000000000000"),
            (id = "0"),
            (releaseID = "0"),
            projectID,
            (metadataTable = "a"),
            (releaseHex = "a"),
            releaseName,
            metaURI,
            releaseType,
            imageURI,
            description,
            releaseURI,
        ]

        var tx = await m3taDaoContractInstance.createRelease(ReleaseStruct, { gasLimit: 5000000 })
        return await tx
    }

    // create post for organisation
    const createPost = async (accountID, postDescription, postTitle, postGalery) => {
        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        let postGaleryURI
        if (postGalery) {
            postGaleryURI = await uploadFileToIpfs(postGalery, "image")
        } else {
            postGaleryURI = ""
        }

        const PostStruct = [address, "0", accountID, "a", postDescription, postTitle, postGalery]

        var tx = await m3taDaoContractInstance.createPost(PostStruct, { gasLimit: 5000000 })
        return await tx
    }

    // create post for individual using lens
    const createLensPost = async (accountID, postDescription, postTitle, image) => {
        let imageURI
        if (image) {
            imageURI = await uploadFileToIpfs(image, "image")
        } else {
            imageURI = ""
        }

        const ipfsResult = await uploadJsonToIpfs({
            version: "1.0.0",
            mainContentFocus: "TEXT_ONLY",
            metadata_id: uuidv4(),
            description: description,
            locale: "en-US",
            content: "Content",
            external_url: null,
            image: imageURI,
            imageMimeType: null,
            name: postTitle,
            attributes: [],
            tags: [],
            appId: "m3tadao.eth",
        })

        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        const inputStruct = {
            profileId: 1,
            contentURI: "https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz",
            collectModule: freeCollectModuleAddr,
            collectModuleInitData: defaultAbiCoder.encode(["bool"], [true]),
            referenceModule: ZERO_ADDRESS,
            referenceModuleInitData: [],
        }

        const PostStruct = [address, "0", accountID, "a", postDescription, postTitle, postGalery]

        var tx = await m3taDaoContractInstance.createPost(PostStruct, { gasLimit: 5000000 })
        return await tx
    }

    const deletePost = async (accountID, postID) => {
        const m3taDaoContractInstance = new ethers.Contract(
            contractAddresses.m3taDao,
            m3taDaoAbi,
            signer
        )

        var tx = await m3taDaoContractInstance.createPost(accountID, postID, { gasLimit: 5000000 })
        return await tx
    }

    return {
        createLensProfile,
        createProjectAccount,
        createSubProject,
        createRelease,
        createPost,
        deletePost,
    }
}

export default useContract
