import { useState } from "react";
import { Tabs, Tab, Box, Typography, Container } from "@mui/material";
import {
  categories,
  type Category,
} from "pages/home/tabsComponent/modulesData";
import { uiText } from "pages/home/layout/uiText";

type TabsModulesProps = {
  activeTab: number | null;
};

export function TabsModules({ activeTab }: TabsModulesProps) {
  const [subTab, setSubTab] = useState(0);

  const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
  };

  const currentCategory = activeTab !== null ? categories[activeTab] : null;

  return (
    <section className="bg-grey-light">
      {activeTab === null ? (
        <>
          <h2 className="bg-accent m-0 py-8 px-4 uppercase text-5xl! text-accent-foreground font-normal! text-center">
            {uiText.main.title}
          </h2>
          <div className="max-w-[1200px] px-4 py-8 mx-auto grid grid-cols-1 gap-4 md:py-16 md:grid-cols-2 md:gap-8">
            {uiText.main.cards.map((card) => (
              <article className="bg-background p-8 rounded-xl">
                <h3 className="flex gap-4 items-center text-primary">
                  {typeof card.image === "string" ? (
                    <img src={card.image} alt="" />
                  ) : (
                    <card.image className="size-8" strokeWidth="1.5" />
                  )}
                  {card.title}
                </h3>
                <p className="m-0!">{card.content}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div id="Tabs">
          <Container maxWidth="lg" sx={{ py: 0, px: 6 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "auto" }}
            >
              <Box
                id="Tab"
                sx={{
                  display: "flex",
                  justifyContent: activeTab === 0 ? "center" : "flex-start",
                  width: "100%",
                }}
              >
                {activeTab === 0 ? (
                  <Box sx={{ mt: 0 }}>
                    <Typography
                      component="h1"
                      variant="h4"
                      className={activeTab === 0 ? "titulo-centrado" : ""}
                      sx={{ mb: 0, color: "white" }}
                    />
                    {"content" in categories[0] && categories[0].content}
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={subTab}
                      onChange={handleSubTabChange}
                      sx={{
                        marginTop: { xs: "77px", sm: "23px" },
                        width: { xs: "100%", sm: 290 },
                        alignSelf: "flex-start",
                      }}
                    >
                      {currentCategory !== null &&
                        "subcategories" in currentCategory &&
                        currentCategory.subcategories.map(
                          (sub: Category, index: number) => (
                            <Tab
                              key={index}
                              label={sub.title}
                              sx={{ border: "none !important" }}
                            />
                          ),
                        )}
                    </Tabs>

                    <Box className="Espaciado" sx={{ flex: 1 }}>
                      <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                          mb: 0,
                          color: "white",
                          textAlign: activeTab === 0 ? "center" : "left",
                        }}
                      >
                        {currentCategory !== null && currentCategory.title}
                      </Typography>
                      <Typography
                        component="div"
                        dangerouslySetInnerHTML={{
                          __html:
                            currentCategory !== null &&
                            "subcategories" in currentCategory
                              ? currentCategory.subcategories[subTab].content
                              : "",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
        </div>
      )}
    </section>
  );
}

// <div id="Tabs">
//   <Container maxWidth="lg" sx={{ py: 0, px: 6 }}>
//     <Box sx={{ display: "flex", flexDirection: "column", height: "auto" }}>
//       <Box
//         id="Tab"
//         sx={{
//           display: "flex",
//           justifyContent: activeTab === 0 ? "center" : "flex-start",
//           width: "100%",
//         }}
//       >
//         {activeTab === 0 ? (
//           <Box sx={{ mt: 0 }}>
//             <Typography
//               component="h1"
//               variant="h4"
//               className={activeTab === 0 ? "titulo-centrado" : ""}
//               sx={{ mb: 0, color: "white" }}
//             />
//             {"content" in categories[0] && categories[0].content}
//           </Box>
//         ) : (
//           <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
//             <Tabs
//               orientation="vertical"
//               variant="scrollable"
//               value={subTab}
//               onChange={handleSubTabChange}
//               sx={{
//                 marginTop: { xs: "77px", sm: "23px" },
//                 width: { xs: "100%", sm: 290 },
//                 alignSelf: "flex-start",
//               }}
//             >
//               {currentCategory !== null &&
//                 "subcategories" in currentCategory &&
//                 currentCategory.subcategories.map(
//                   (sub: Category, index: number) => (
//                     <Tab
//                       key={index}
//                       label={sub.title}
//                       sx={{ border: "none !important" }}
//                     />
//                   ),
//                 )}
//             </Tabs>
//
//             <Box className="Espaciado" sx={{ flex: 1 }}>
//               <Typography
//                 component="h1"
//                 variant="h4"
//                 sx={{
//                   mb: 0,
//                   color: "white",
//                   textAlign: activeTab === 0 ? "center" : "left",
//                 }}
//               >
//                 {currentCategory !== null && currentCategory.title}
//               </Typography>
//               <Typography
//                 component="div"
//                 dangerouslySetInnerHTML={{
//                   __html:
//                     currentCategory !== null &&
//                     "subcategories" in currentCategory
//                       ? currentCategory.subcategories[subTab].content
//                       : "",
//                 }}
//               />
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   </Container>
// </div>
