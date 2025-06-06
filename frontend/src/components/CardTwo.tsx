import { useAccount, useReadContract } from "wagmi";
import {
  EVENT_MARKETPLACE_ADDRESS,
  EVENTMARKETPLACEABI,
} from "../constants";
import { MdEventNote } from "react-icons/md";

const CardTwo = () => {
  // Items in the marketplace
  const { data } = useReadContract({
    address: EVENT_MARKETPLACE_ADDRESS,
    abi: EVENTMARKETPLACEABI,
    functionName: "listingId",
  });

  return (
    <div className="relative rounded-xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:shadow-none dark:border-base-300 dark:bg-default-50">
      <div className="absolute right-4 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-default-200">
        <MdEventNote className="text-white" />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-4">
          <span className="text-sm font-medium">Total Marketplace Events</span>
          <h4 className="font-firaSans font-bold text-8xl text-black dark:text-white">
            {Number(data) || 0}
          </h4>
        </div>

        {/* <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
          4.35%
          <svg
            className="fill-meta-3"
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
              fill=""
            />
          </svg>
        </span> */}
      </div>
    </div>
  );
};

export default CardTwo;
