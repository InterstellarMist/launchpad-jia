import { Card } from "./Card";

export const TipsCard = ({
  tips,
}: {
  tips: { statement: string; description: string }[];
}) => {
  return (
    <Card title="Tips" icon="tips" gap={0}>
      {tips.map((tip, index) => (
        <p
          key={index}
          style={{
            fontSize: 14,
            color: "#717680",
            fontWeight: 500,
            marginBottom: `${index === tips.length - 1 ? 0 : 14}px`,
          }}
        >
          <span style={{ fontWeight: 700, color: "#181D27" }}>
            {tip.statement}
          </span>{" "}
          {tip.description}
        </p>
      ))}
    </Card>
  );
};
