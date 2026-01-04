import { Link } from 'react-router-dom';

const CategoryCard = ({ category, image }) => {
    return (
        <Link
            to={`/customer/category/${category}`}
            className="group relative block overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[3/4]"
        >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
            <img
                src={image}
                alt={category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-20">
                <span className="text-white/80 text-xs font-sans tracking-[0.2em] uppercase mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Collection
                </span>
                <h3 className="text-white text-2xl font-serif font-bold uppercase tracking-widest text-center px-4 drop-shadow-md">
                    {category}
                </h3>
            </div>
        </Link>
    );
};

export default CategoryCard;
