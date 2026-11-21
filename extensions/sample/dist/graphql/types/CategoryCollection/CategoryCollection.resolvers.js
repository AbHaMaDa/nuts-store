export default {
    CategoryCollection: {
        items: async (collection)=>{
            const items = await collection.items();
            return [
                ...items
            ].sort((a, b)=>(a.position ?? 0) - (b.position ?? 0));
        }
    }
};
